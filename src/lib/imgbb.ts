const IMGBB_API_KEY = '3aa7c298084dec017af906eaed607fd0';

export async function uploadImageToImgBB(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file (JPG, PNG, WEBP).');
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Image size must be under 10 MB.');
  }

  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`ImgBB upload failed (${response.status}).`);
  }

  const json = (await response.json()) as {
    success?: boolean;
    data?: { display_url?: string; url?: string };
    error?: { message?: string };
  };

  if (!json.success || !(json.data?.display_url || json.data?.url)) {
    throw new Error(json.error?.message || 'ImgBB upload did not return an image URL.');
  }

  return json.data.display_url || json.data.url || '';
}
