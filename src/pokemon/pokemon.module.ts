import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    
    //Este metodo es una función de mongooseModule, se usa para definir y registrar modelos especificos de mongoose
    MongooseModule.forFeature([
      {
          name: Pokemon.name,
          schema: PokemonSchema,
      }
    ])
  ],
  exports: [
    MongooseModule
  ],
})
export class PokemonModule {}
