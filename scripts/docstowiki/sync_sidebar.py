import os
import re

# Set the path to your source file
SOURCE_FILE = "docs/readme.md"


def sync_block():
    if not os.path.exists(SOURCE_FILE):
        print(f"Error: Source file '{SOURCE_FILE}' not found.")
        return

    # Extract the directory path (e.g., 'docs/')
    source_dir = os.path.dirname(SOURCE_FILE)

    with open(SOURCE_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Regex to capture the target filename and block content
    pattern = r'<!--sync-to:\s*"([^"]+)"\s*-->(.*?)<!--sync-end-->'
    match = re.search(pattern, content, re.DOTALL)

    if not match:
        print("Error: No valid sync block found.")
        return

    target_filename = match.group(1)
    block_content = match.group(2).strip()

    # Combine the source directory with the target filename
    # Result: 'docs/_Sidebar.md'
    target_filepath = os.path.join(source_dir, target_filename)

    # Write the extracted content to the correct directory
    with open(target_filepath, "w", encoding="utf-8") as f:
        f.write(block_content + "\n")

    print(f"Success! Sync block copied to '{target_filepath}'.")


if __name__ == "__main__":
    sync_block()
