$wildlife = Get-ChildItem -Path '.\images\gallery\wildlife' -Filter *.jpg | Select-Object -ExpandProperty Name
$serengeti = Get-ChildItem -Path '.\images\gallery\serengeti' -Filter *.jpg | Select-Object -ExpandProperty Name
$kilimanjaro = Get-ChildItem -Path '.\images\gallery\kilimanjaro' -Filter *.jpg | Select-Object -ExpandProperty Name
$zanzibar = Get-ChildItem -Path '.\images\gallery\zanzibar' -Filter *.jpg | Select-Object -ExpandProperty Name
$culture = Get-ChildItem -Path '.\images\gallery\culture' -Filter *.jpg | Select-Object -ExpandProperty Name

$html = Get-Content -Raw .\pages\gallery.html
$matches = [regex]::Matches($html, 'data-cat="([^"]*)"')
$dataCats = $matches | ForEach-Object { $_.Groups[1].Value }

$wildlifeIndex = 0
$serengetiIndex = 0
$kilimanjaroIndex = 0
$zanzibarIndex = 0
$cultureIndex = 0

$newItems = @()

foreach ($catString in $dataCats) {
    $firstCat = ($catString -split ' ')[0]
    switch ($firstCat) {
        'wildlife' {
            $img = $wildlife[$wildlifeIndex]
            $wildlifeIndex = ($wildlifeIndex + 1) % $wildlife.Count
        }
        'serengeti' {
            $img = $serengeti[$serengetiIndex]
            $serengetiIndex = ($serengetiIndex + 1) % $serengeti.Count
        }
        'kilimanjaro' {
            $img = $kilimanjaro[$kilimanjaroIndex]
            $kilimanjaroIndex = ($kilimanjaroIndex + 1) % $kilimanjaro.Count
        }
        'zanzibar' {
            $img = $zanzibar[$zanzibarIndex]
            $zanzibarIndex = ($zanzibarIndex + 1) % $zanzibar.Count
        }
        'culture' {
            $img = $culture[$cultureIndex]
            $cultureIndex = ($cultureIndex + 1) % $culture.Count
        }
    }
    $filenameWithoutExt = [System.IO.Path]::GetFileNameWithoutExtension($img)
    $item = "<div class=`"masonry-item gal-item`" data-cat=`"$catString`">
  <img src=`".\images\gallery\$firstCat\$img`" alt=`"$filenameWithoutExt`" loading=`"lazy`" />
  <div class=`"gal-overlay`"><i class=`"fa-solid fa-magnifying-glass-plus`"></i><span class=`"gal-label`">$filenameWithoutExt</span></div>
</div>"
    $newItems += $item
}

$newGrid = $newItems -join "`n"

$htmlLines = Get-Content .\pages\gallery.html
$inGrid = $false
$newHtml = @()

foreach ($line in $htmlLines) {
    if ($line -match '<div class=`"masonry`" id=`"gallery-grid`">') {
        $inGrid = $true
        $newHtml += $line
        $newHtml += $newGrid
        continue
    }
    if ($inGrid -and $line -match '</div>') {
        $inGrid = $false
        $newHtml += $line
        continue
    }
    if (-not $inGrid) {
        $newHtml += $line
    }
}

$newHtml -join "`n" | Set-Content .\pages\gallery.html