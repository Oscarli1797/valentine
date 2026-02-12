Add-Type -AssemblyName System.Drawing

Get-ChildItem *.jpg | ForEach-Object {

    $inputPath = $_.FullName
    $tempPath = [System.IO.Path]::ChangeExtension($inputPath, ".tmp.jpg")

    $img = [System.Drawing.Image]::FromFile($inputPath)

    $newWidth = 512
    $ratio = $newWidth / $img.Width
    $newHeight = [int]($img.Height * $ratio)

    $bmp = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
    $graphics = [System.Drawing.Graphics]::FromImage($bmp)

    $graphics.InterpolationMode = "HighQualityBicubic"
    $graphics.DrawImage($img, 0, 0, $newWidth, $newHeight)

    # 先保存到临时文件（关键）
    $bmp.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)

    $graphics.Dispose()
    $bmp.Dispose()
    $img.Dispose()

    # 替换原文件
    Remove-Item $inputPath
    Rename-Item $tempPath $inputPath
}
