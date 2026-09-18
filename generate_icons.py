# ==========================================================================
# Generador de Iconos PNG para PWA de CORAL (sin dependencias externas)
# ==========================================================================
import zlib
import struct
import math
import os

def create_png(width, height, get_pixel_fn, filename):
    # Cabecera PNG
    png_signature = b'\x89PNG\r\n\x1a\n'
    
    # Chunk IHDR
    # Ancho (4 bytes), Alto (4 bytes), Profundidad (1 byte: 8), Tipo de Color (1 byte: 6 = RGBA),
    # Compresion (0), Filtro (0), Interlace (0)
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
    ihdr_chunk = struct.pack('>I', len(ihdr_data)) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)
    
    # Datos de imagen en filas con filtro 0 (None)
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0) # Filter byte: 0
        for x in range(width):
            r, g, b, a = get_pixel_fn(x, y, width, height)
            raw_data.extend([int(r) & 0xFF, int(g) & 0xFF, int(b) & 0xFF, int(a) & 0xFF])
            
    # Chunk IDAT (Comprimido con zlib)
    compressed_data = zlib.compress(bytes(raw_data), level=9)
    idat_crc = zlib.crc32(b'IDAT' + compressed_data)
    idat_chunk = struct.pack('>I', len(compressed_data)) + b'IDAT' + compressed_data + struct.pack('>I', idat_crc)
    
    # Chunk IEND
    iend_crc = zlib.crc32(b'IEND')
    iend_chunk = struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)
    
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, 'wb') as f:
        f.write(png_signature + ihdr_chunk + idat_chunk + iend_chunk)
    print(f"Icono generado exitosamente: {filename} ({width}x{height})")

def coral_icon_pixel(x, y, w, h, maskable=False):
    nx = x / w
    ny = y / h
    cx, cy = 0.5, 0.5
    dx = nx - cx
    dy = ny - cy
    dist = math.sqrt(dx*dx + dy*dy)
    
    # Esquinas redondeadas si no es maskable
    if not maskable and (abs(dx) > 0.44 or abs(dy) > 0.44):
        # Radio de esquina ~ 22%
        corner_x = max(0.0, abs(dx) - 0.28)
        corner_y = max(0.0, abs(dy) - 0.28)
        if math.sqrt(corner_x*corner_x + corner_y*corner_y) > 0.20:
            return (0, 0, 0, 0)

    # Fondo marino degradado radial
    grad = math.sqrt((nx - 0.5)**2 + (ny - 0.35)**2) / 0.7
    grad = max(0.0, min(1.0, grad))
    
    # Color base: Azul abisal a turquesa profundo
    r = int(19 * (1 - grad) + 5 * grad)
    g = int(85 * (1 - grad) + 22 * grad)
    b = int(140 * (1 - grad) + 34 * grad)
    a = 255
    
    # Concha dorada / Perla central
    p_dist = math.sqrt((nx - 0.5)**2 + (ny - 0.52)**2)
    if p_dist < 0.24:
        # Forma de concha / cola
        wave = math.sin(nx * 30.0) * 0.02
        if p_dist < 0.20 + wave:
            r = int(42 + 210 * (1 - p_dist * 4))
            g = int(213 * (1 - p_dist * 2))
            b = int(196 * (1 - p_dist * 2))
            
    # Perla brillante dorada central
    pearl_dist = math.sqrt((nx - 0.5)**2 + (ny - 0.50)**2)
    if pearl_dist < 0.09:
        highlight = max(0.0, 1.0 - pearl_dist / 0.09)
        r = int(255 * highlight + 254 * (1 - highlight))
        g = int(240 * highlight + 209 * (1 - highlight))
        b = int(138 * highlight + 82 * (1 - highlight))
        
    # Flor de la Vida / Corona de flores en la parte superior
    flower_dist = math.sqrt((nx - 0.5)**2 + (ny - 0.28)**2)
    if flower_dist < 0.07:
        r = 255
        g = 79
        b = 168

    # Borde turquesa brillante sutil
    if not maskable and (abs(dx) > 0.46 or abs(dy) > 0.46):
        r = int(r * 0.5 + 42 * 0.5)
        g = int(g * 0.5 + 213 * 0.5)
        b = int(b * 0.5 + 196 * 0.5)

    return (r, g, b, a)

if __name__ == '__main__':
    create_png(192, 192, lambda x, y, w, h: coral_icon_pixel(x, y, w, h, False), 'assets/icons/icon-192.png')
    create_png(512, 512, lambda x, y, w, h: coral_icon_pixel(x, y, w, h, False), 'assets/icons/icon-512.png')
    create_png(512, 512, lambda x, y, w, h: coral_icon_pixel(x, y, w, h, True), 'assets/icons/icon-maskable.png')
