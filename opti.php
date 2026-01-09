<?php
// Script très basique pour convertir les JPG en WebP
$dir = 'logos/'; 
$files = glob($dir . "*.{jpg,jpeg,png}", GLOB_BRACE);

foreach($files as $file) {
    $info = pathinfo($file);
    $output = $dir . $info['filename'] . '.webp';
    
    if ($info['extension'] == 'png') {
        $img = imagecreatefrompng($file);
    } else {
        $img = imagecreatefromjpeg($file);
    }
    
    // On sauvegarde en WebP avec une qualité de 80%
    imagewebp($img, $output, 80);
    imagedestroy($img);
    echo "Optimisé : $output <br>";
}
?>