import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform<Express.Multer.File> {
  transform(file: Express.Multer.File) {
    const maxSize = 5 * 1024 * 1024;

    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }

    if (file.size > maxSize) {
      throw new BadRequestException('Image size cannot exceed 5 MB.');
    }

    return file;
  }
}
