import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {

  constructor(
    //Realizamos la inyeccion de dependencia para la base de datos
    @InjectModel(Pokemon.name)  //Nos permite inyectar nuestros modelos
    private readonly pokemonModel: Model<Pokemon>
  ){} 

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    //Controlar los errores
    try {
        //Inserción a la base de datos
        const Pokemon = await this.pokemonModel.create(createPokemonDto);
        return Pokemon;  

    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
      return await this.pokemonModel.find()
  }

  async findOne(term : string) {
    //Se realizara la busqueda por los atributos de mi entity: no,name, id

    //Primero con el no:
    let pokemon: Pokemon;

    if(!isNaN(+term)){
      pokemon = await this.pokemonModel.findOne({ no: term})
    }

    //Busqueda por MongoID

    if(!pokemon && isValidObjectId(term)){
      pokemon = await this.pokemonModel.findById( term );
    }
    //Busqueda por Name

    if(!pokemon){
      pokemon = await this.pokemonModel.findOne( { name: term.toLowerCase().trim()} );
    }


    if(!pokemon) throw new NotFoundException(`Pokemon with id, name or no "${ term }" not found`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    if(updatePokemonDto.name){
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
      }
    try {
      const pokemon = await this.findOne(term);

          await pokemon.updateOne(updatePokemonDto);

          return { ...pokemon.toJSON(), ...updatePokemonDto};

    } catch (error) { 
      this.handleExceptions(error);
    }

  }

  async remove(id: string) {
    // const pokemon = await this.findOne(term);
    // await pokemon.deleteOne();
    // const result = await this.pokemonModel.findByIdAndDelete(term);
    const { deletedCount } = await this.pokemonModel.deleteOne({_id: id});
    if( deletedCount === 0){
      throw new BadRequestException(`Pokemon with id "${id}" not found`);
    }

    return `The pokemon was deleted`;
  }


  //Creamos funcion para reutilizar los errores
  private handleExceptions(error: any){
    if(error.code === 11000){
      throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`);
    }
    console.log(error)
      throw new InternalServerErrorException(`Cant update pokemon- Check server logs`);
  }

}
