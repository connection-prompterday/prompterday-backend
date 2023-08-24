import { Body, Controller, Post } from '@nestjs/common';
import { ChatGptService } from './chat-gpt.service';
import { GetAdviseDto } from './dto/get-advise.dto';
import { ChemistResponse, NutritionistResponse } from './interface/interface';
import { ApiGetAdviseFromNutritionist } from './swagger-decorator/get-advise-from-nutritionist.decorator';
import { ExtractIngredientsDto } from './dto/extract-ingredients-dto';
import { ApiExtractIngredients } from './swagger-decorator/extract-ingredients.decorator';
import { ApiGetAdviseFromChemist } from './swagger-decorator/get-advise-from-chemist.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ChatGpt')
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

  @Post('/chemist')
  @ApiGetAdviseFromChemist()
  async getAdviseFromChemist(
    @Body() getAdviseDto: GetAdviseDto,
  ): Promise<ChemistResponse[]> {
    const response: ChemistResponse[] =
      await this.chatGptService.getAdviseFromNutritionist(getAdviseDto);

    return response;
  }
}
