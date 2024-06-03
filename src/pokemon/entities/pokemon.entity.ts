import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Pokemon extends Document {

    // id: string // Mongo me lo da

    @Prop({
        unique: true,
        index: true, //Nos permite saber donde esta elemento que estamos buscado
    })
    name: string;
    
    @Prop({
        unique: true,
        index: true, //Nos permite saber donde esta elemento que estamos buscado
    })
    no: number;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
