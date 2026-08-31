# LoreFlow File Format Specifications

Taken from <https://github.com/Galygious/Lore-Flow>

## **🔹 Why TOML for File Formats?**
LoreFlow's **Lore Template Types (`.ltt`)** and **Lore Files (`.ltf`)** are built on **TOML (Tom’s Obvious, Minimal Language)**, a lightweight configuration language designed for **human readability and machine efficiency**.  

### **Why TOML?**
✅ **Readable & Simple** – Easier to understand and edit compared to JSON or XML.  
✅ **Lightweight & Portable** – No database needed, making file sharing and organization simple.  
✅ **Structured Yet Flexible** – Supports **nested sections, typed values, and inline tables** for structured world-building.  
✅ **Minimal Syntax** – Avoids unnecessary symbols (`{}` brackets like JSON or `<tags>` like XML).  

## Overview

LoreFlow uses two primary file formats:
1. `.ltt` (Lore Template Type) - Defines the structure and validation rules for lore entries
2. `.ltf` (Lore File) - Contains the actual lore entry data

## Lore Template Type (.ltt)

### Required Key Fields

| Attribute | Type | Required? | Description |
|------------|--------|-----------|------------------------------------------------------|
| **`key`** | `string` | ✅ Required | The internal field name used in `.ltf`. |
| **`title`** | `string` | ✅ Required | The display name (for UI & readability). |
| **`type`** | `string` | ✅ Required | Defines data type (`string`, `integer`, etc.). |
| **`ui_component`** | `string` | ✅ Required | Determines how the UI should render the field. |
| **`required`** | `boolean` | ✅ Required | Ensures the field must be filled (`true`/`false`). |

### Optional Key Fields

| Attribute | Type | Description |
|------------|--------|-------------|
| **`description`** | `string` | Tooltip or helper text for UI. |
| **`default`** | `mixed` | The default value if nothing is entered. |
| **`options`** | `array` | Dropdown choices (if `ui_component = "dropdown"`). |
| **`placeholder`** | `string` | Placeholder text for text inputs. |
| **`validation`** | `table` | Inline constraints like min/max values. |
| **`validation_file`** | `string` | External validation function reference. |

### File Structure

```toml
[header]
name = "template_name"          # Required: Template identifier
version = "1.0"                # Required: Version for compatibility
description = "..."            # Optional: Template description
author = "System"              # Optional: Template creator
uuid = "unique-uuid"           # Required: Template identifier

[fields.section_name]          # Group fields by logical sections
title = "Section Title"        # Human-readable section name
keys = [
    {
        key = "field_name",    # Internal field identifier
        title = "Field Title", # Display name
        type = "string",       # Data type
        ui_component = "text", # UI rendering type
        required = true,       # Field requirement
        description = "...",   # Optional: Helper text
        default = "value",     # Optional: Default value
        options = [],         # Optional: Dropdown choices
        placeholder = "...",   # Optional: Input placeholder
        validation = {},      # Optional: Validation rules
    }
]

[footer]
constraints = "..."           # Optional: General constraints
notes = "..."                # Optional: Additional notes
```

## Lore File (.ltf)

### Header Structure

| Field | Type | Required? | Description |
|--------|--------|-----------|-------------|
| `ltt` | `string` | ✅ Required | Template type reference |
| `version` | `string` | ✅ Required | Format version |
| `created` | `datetime` | ✅ Required | Creation timestamp |
| `last_edited` | `datetime` | ✅ Required | Last modification |
| `author` | `string` | ✅ Required | Entry creator |
| `uuid` | `string` | ✅ Required | Unique identifier |
| `tags` | `array` | 🔹 Optional | Search/categorization tags |
| `status` | `string` | 🔹 Optional | Entry status |

### File Structure

```toml
[header]
ltt = "template_name"         # Template reference
version = "1.0"              # Format version
created = "ISO8601-timestamp"
last_edited = "ISO8601-timestamp"
author = "username"
uuid = "unique-uuid"
tags = ["tag1", "tag2"]      # Optional
status = "draft"             # Optional

[data.section_name]          # Data grouped by template sections
field_name = "value"         # Values matching template structure

[footer.references]          # Related entries
related_files = [
    {
        uuid = "related-uuid",
        path = "relative/path/to/file.ltf"
    }
]
```

## Relationships and References

- References use both UUID and relative file paths
- UUID ensures persistent relationships even if files are moved
- File paths provide human-readable context and easier navigation
- Relative paths maintain portability across systems

## Validation Rules

### Template Validation
- All required fields must be present
- Data types must match template specifications
- Custom validation rules in `validation` table are enforced
- External validation via `validation_file` if specified

### Entry Validation
- Must reference valid template
- All required template fields must be filled
- Data must match template type constraints
- References must point to valid UUIDs/files

## Best Practices

1. **Template Design**
   - Use clear, descriptive field titles
   - Group related fields in logical sections
   - Provide helpful descriptions
   - Set appropriate default values

2. **Entry Creation**
   - Use meaningful tags for searchability
   - Maintain accurate relationships
   - Keep status field updated
   - Use relative paths for references

3. **File Organization**
   - Group related entries in directories
   - Use consistent naming conventions
   - Maintain template versions
   - Regular backups of templates

## Implementation Notes

1. **File Handling**
   - Use TOML parser with UTF-8 encoding
   - Implement file watchers for auto-save
   - Handle concurrent access gracefully

2. **UI Considerations**
   - Dynamic form generation from templates
   - Real-time validation feedback
   - Auto-complete for references
   - Preview capabilities

3. **Performance**
   - Cache frequently used templates
   - Lazy load entry content
   - Optimize relationship queries
   - Index for quick search