const API_URL = import.meta.env.VITE_API_URL;

export const fetchFolders = async (tenant: string, path: string): Promise<string[]> => {
  try {
    const response = await fetch(`${API_URL}/api/v2/files/symbits/${tenant}${path}`);
    if (!response.ok) throw new Error('Error fetching folders');
    let folders = await response.json();

    return folders.filter((folder) => typeof folder === 'string')
    .map(path => {
      const parts = path.split('/');
      const index = parts.indexOf('symbits');
      if (index !== -1 && index + 1 < parts.length) {
        return parts.slice(index + 1).join('/');
      }
      return null;
    }).filter(Boolean);
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

export const fetchFiles = async () => {
    // try {
    //     const response = await fetch(`${API_URL}/list`);
    //     if (!response.ok) throw new Error('Error fetching files');
    //     return await response.json();
    // } catch (error) {
    //     console.error('Error:', error);
    //     return [];
    // }
}

export const fetchFolderDetails = async (tenant: string, path: string) => {
  try {
    const response = await fetch(`${API_URL}/api/v2/files/symbits/${tenant}${path}`);
    if (!response.ok) throw new Error('Error fetching folders');
    return await response.json();
  } catch (error) {
    return [];
  }
}

export const downloadFile = async (tenant: string, path: string) => {
  try {
    const response = await fetch(`${API_URL}/api/v2/files/symbits/${tenant}${path.split(tenant)[1]}`);
    if (!response.ok) throw new Error('Error fetching folders');
    const blob = await response.blob();

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = path.split('/')[path.split('/').length -1]; 
    document.body.appendChild(link); 
    link.click();
    document.body.removeChild(link); 
  } catch (error) {
    return [];
  }
}

export const uploadFile = async () => {
    // const formData = new FormData();
    // formData.append('file', file);

    // try {
    //     const response = await fetch(`${API_URL}/upload`, {
    //         method: 'POST',
    //         body: formData
    //     });

    //     if (!response.ok) throw new Error('Error uploading file');
    //     return await response.json();
    // } catch (error) {
    //     console.error('Error:', error);
    //     return null;
    // }
}

export const deleteFile = async () => {}

export const renameFile = async () => {}

export const createFolder = async () => {}

export const moveItem = async () => {}

export async function copyItem() {}

// Puedes agregar funciones adicionales para otras acciones (por ejemplo, eliminar, renombrar, etc.).
