export class Reporte{

  _id?: number;
  title: string;
  name: string;
  text: string;

  constructor(title: string, name: string, text: string){
      this.title=title;
      this.name= name;
      this.text= text;
  }
}
