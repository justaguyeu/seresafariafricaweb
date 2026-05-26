# Get all images from each category folder
$wildlifeImages = Get-ChildItem -Path '.\images\gallery\wildlife' -Filter *.jpg | Select-Object -ExpandProperty Name
$serengetiImages = Get-ChildItem -Path '.\images\gallery\serengeti' -Filter *.jpg | Select-Object -ExpandProperty Name
$kilimanjaroImages = Get-ChildItem -Path '.\images\gallery\kilimanjaro' -Filter *.jpg | Select-Object -ExpandProperty Name
$zanzibarImages = Get-ChildItem -Path '.\images\gallery\zanzibar' -Filter *.jpg | Select-Object -ExpandProperty Name
$cultureImages = Get-ChildItem -Path '.\images\gallery\culture' -Filter *.jpg | Select-Object -ExpandProperty Name

# Read the HTML file
$html = Get-Content -Raw .\pages\gallery.html

# Find all masonry items with their data-cat attributes
$matches = [regex]::Matches($html, '<div class="masonry-item gal-item" data-cat="([^"]*)">.*?</div>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
$itemsToReplace = @()

foreach ($match in $matches) {
    $fullMatch = $match.Value
    $dataCat = $match.Groups[1].Value
    $itemsToReplace += @{
        FullMatch = $fullMatch
        DataCat = $dataCat
    }
}

# Process each item to create replacement
$replacements = @()
$wildlifeIndex = 0
$serengetiIndex = 0
$kilimanjaroIndex = 0
$zanzibarIndex = 0
$cultureIndex = 0

foreach ($item in $itemsToReplace) {
    $dataCat = $item.DataCat
    $firstCat = ($dataCat -split ' ')[0]
    
    # Select image based on first category
    switch ($firstCat) {
        'wildlife' {
            $imageName = $wildlifeImages[$wildlifeIndex % $wildlifeImages.Count]
            $wildlifeIndex++
        }
        'serengeti' {
            $imageName = $serengetiImages[$serengetiIndex % $serengetiImages.Count]
            $serengetiIndex++
        }
        'kilimanjaro' {
            $imageName = $kilimanjaroImages[$kilimanjaroIndex % $kilimanjaroImages.Count]
            $kilimanjaroIndex++
        }
        'zanzibar' {
            $imageName = $zanzibarImages[$zanzibarIndex % $zanzibarImages.Count]
            $zanzibarIndex++
        }
        'culture' {
            $imageName = $cultureImages[$cultureIndex % $cultureImages.Count]
            $cultureIndex++
        }
    }
    
    # Create filename without extension for alt text
    $filenameWithoutExt = [System.IO.Path]::GetFileNameWithoutExtension($imageName)
    
    # Create the replacement HTML
    $newItem = '<div class="masonry-item gal-item" data-cat="' + $dataCat + '">' + [Environment]::NewLine +
               '  <img src=".\images\gallery\' + $firstCat + '\' + $imageName + '" alt="' + $filenameWithoutExt + '" loading="lazy" />' + [Environment]::NewLine +
               '  <div class="gal-overlay"><i class="fa-solid fa-magnifying-glass-plus"></i><span class="gal-label">' + $filenameWithoutExt + '</span></div>' + [Environment]::NewLine +
               '</div>'
    
    $replacements += @{
        Old = $item.FullMatch
        New = $newItem
    }
}

# Apply all replacements
$newHtml = $html
foreach ($rep in $replacements) {
    $newHtml = $newHtml.Replace($rep.Old, $rep.New)
}

# Also update the background image in the header (optional, keeping Unsplash for now)
# $newHtml = $newHtml -replace "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5\?w=1600\&q=85", ".\images\gallery\wildlife\$($wildlifeImages[0])"

# Write back to file
$newHtml | Set-Content .\pages\gallery.html -Encoding UTF8

Write-Host "Updated gallery with local images"
Write-Host "Wildlife images used: $wildlifeIndex"
Write-Host "Serengeti images used: $serengetiIndex"
Write-Host "Kilimanjaro images used: $kilimanjaroIndex"
Write-Host "Zanzibar images used: $zanzibarIndex"
Write-Host "Culture images used: $cultureIndex"