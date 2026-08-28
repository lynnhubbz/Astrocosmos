# CURRENTLY ONLY WORK FOR WINDOWS

# 1. Activate the python virtual environment inside the current script scope
Write-Host "Activating python .venv..." -ForegroundColor Cyan
(Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned) ; (& .venv\Scripts\Activate.ps1)

# Run pipreqsnb cleanly
Write-Host "Scanning code for used packages..." -ForegroundColor Cyan
pipreqsnb . --ignore .venv --encoding utf-8 --force

# Function to safely update or append package versions in requirements.txt
function Update-Requirement {
    param ([string]$PackageName)
    
    $Path = ".\requirements.txt"
    
    # Extract the exact version line from pip freeze safely (e.g., "ipykernel==6.29.5")
    $ExactVersion = (pip freeze | Select-String -Pattern "^${PackageName}==").Line
    if (-not $ExactVersion) { $ExactVersion = $PackageName }

    # Load existing requirements content safely
    $Content = Get-Content -Path $Path -Encoding Utf8 -ErrorAction SilentlyContinue
    
    # Regex pattern to match the package name ignoring case and version variations
    $Pattern = "(?i)^${PackageName}(==|>=|<=|>|<|`$)"

    if ($Content -match $Pattern) {
        # If the package exists, replace the line with the updated version inline
        $Content = $Content | ForEach-Object { $_ -replace $Pattern, $ExactVersion }
        Set-Content -Path $Path -Value $Content -Encoding Utf8
    } else {
        # If the package does not exist, append it safely to the end
        Add-Content -Path $Path -Value $ExactVersion -Encoding Utf8
    }
}

# 2. Update or append ipykernel safely
Write-Host "Updating ipykernel..." -ForegroundColor Cyan
Update-Requirement -PackageName "ipykernel"

# 3. Update or append nbstripout safely
Write-Host "Updating nbstripout..." -ForegroundColor Cyan
Update-Requirement -PackageName "nbstripout"

# 4. Update or append pipreqsnb safely
Write-Host "Updating pipreqsnb..." -ForegroundColor Cyan
Update-Requirement -PackageName "pipreqsnb"

# 5. Alphabetical Sort Step
Write-Host "Sorting requirements.txt alphabetically..." -ForegroundColor Cyan
if (Test-Path ".\requirements.txt") {
    $SortedContent = Get-Content -Path ".\requirements.txt" | 
                     Where-Object { $_.Trim() -ne "" } | 
                     Sort-Object
    Set-Content -Path ".\requirements.txt" -Value $SortedContent -Encoding Utf8
}

Write-Host "Successfully updated and sorted clean requirements.txt!" -ForegroundColor Green