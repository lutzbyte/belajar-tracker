// Potong dari tengah ke rasio width:height, lalu simpan sebagai JPEG kecil (data URL)
export async function fileToImage(
  file: File,
  width: number,
  height: number,
  quality = 0.82,
): Promise<string> {
  const bmp = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas')

  ctx.fillStyle = '#F7F5EE'
  ctx.fillRect(0, 0, width, height)

  const scale = Math.max(width / bmp.width, height / bmp.height)
  const sw = width / scale
  const sh = height / scale
  ctx.drawImage(bmp, (bmp.width - sw) / 2, (bmp.height - sh) / 2, sw, sh, 0, 0, width, height)
  bmp.close()
  return canvas.toDataURL('image/jpeg', quality)
}