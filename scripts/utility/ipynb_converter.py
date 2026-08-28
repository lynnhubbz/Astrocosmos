# %%
# save it here for now. used to convert file that is running this script
# things to do with this: turn this into a function

import nbformat
from nbconvert import MarkdownExporter
from nbconvert.preprocessors import Preprocessor
from nbconvert.writers.files import FilesWriter

# 1. Create a custom preprocessor to clean the outputs
class CleanErrorsPreprocessor(Preprocessor):
    def preprocess_cell(self, cell, resources, index):
        if cell.cell_type == 'code':
            # Filter out error outputs and warning streams
            clean_outputs = []
            for output in cell.outputs:
                # 1. Skip explicit Python traceback errors
                if output.output_type == 'error':
                    continue
                # 2. Skip stderr text streams (where warnings and logs are sent)
                if output.output_type == 'stream' and output.name == 'stderr':
                    continue
                clean_outputs.append(output)
            cell.outputs = clean_outputs
        return cell, resources

# 2. Read the notebook content
notebook_filename = 'test.ipynb' 
with open(notebook_filename, 'r', encoding='utf-8') as f:
    notebook_content = nbformat.read(f, as_version=4)

# 3. Initialize exporter and hide raw code cells
markdown_exporter = MarkdownExporter()
markdown_exporter.exclude_input = True 

# 4. Register our custom error cleaner
markdown_exporter.register_preprocessor(CleanErrorsPreprocessor(), enabled=True)

# 5. Convert the notebook structure
(body, resources) = markdown_exporter.from_notebook_node(notebook_content)

# 6. Save the clean markdown report
file_writer = FilesWriter()
file_writer.write(body, resources, notebook_name='clean_report_notebook')
print("") # this print line is a must, if not, it will output a print announcing nbconvert is succesful and exist in the resulted makrdown


