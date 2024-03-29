export interface FileType {
  id: string
  fileType: 'image' | 'video'
  favorite: boolean
  name: string
  fileName: string
  height: number
  width: number
}

export interface ExtendedFileType extends FileType {
  url: string
  thumbnailUrl?: string
}

export interface registerUserType {
  email: string
  password: string
  name?: string
}
