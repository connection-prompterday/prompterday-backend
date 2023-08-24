import { Body, Controller, Post } from '@nestjs/common';
import { ChatGptService } from './chat-gpt.service';
import { GetAdviseDto } from './dto/get-advise.dto';
import { NutritionistResponse } from './interface/interface';
import { ApiGetAdviseFromNutritionist } from './swagger-decorator/get-advise-from-nutritionist.decorator';
import { ExtractIngredientsDto } from './dto/extract-ingredients-dto';
import { ApiExtractIngredients } from './swagger-decorator/extract-ingredients.decorator';

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

  @Post('/ingredients')
  @ApiExtractIngredients()
  async extractIngredients(
    @Body() extractIngredientsDto: ExtractIngredientsDto,
  ): Promise<string[]> {
    const extractedIngredients: string[] =
      await this.chatGptService.extractIngredients(extractIngredientsDto);

    return extractedIngredients;
  }
}
