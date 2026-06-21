import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 'f7c7b4ec-1851-4d57-a3ce-a9b7ef4f5aac' })
  id: string;

  @ApiProperty({ example: 'Maria Silva' })
  name: string;

  @ApiProperty({ example: 'maria@exemplo.com' })
  email: string;
}
