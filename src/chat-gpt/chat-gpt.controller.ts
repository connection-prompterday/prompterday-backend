import { Body, Controller, Post } from '@nestjs/common';
import { ChatGptService } from './chat-gpt.service';
import { GetAdviseDto } from './dto/get-advise.dto';
import { NutritionistResponse } from './interface/interface';
import { ApiGetAdviseFromNutritionist } from './swagger/get-advise-from-nutritionist.decorator';

@Controller('chat-gpt')
export class ChatGptController {
  constructor(private readonly chatGptService: ChatGptService) {}

  @Post('/nutritionist')
  @ApiGetAdviseFromNutritionist()
  async getAdviseFromNutritionist(
    @Body() getAdviseDto: GetAdviseDto,
  ): Promise<NutritionistResponse[]> {
    const response: NutritionistResponse[] =
      await this.chatGptService.getAdviseFromNutritionist(getAdviseDto);

    return response;
  }
}
