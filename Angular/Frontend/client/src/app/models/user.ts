export class User{

  _id?: number;
  name: string;
  userName: string;
  pass: string;
  role: string;

  constructor(name: string, userName: string, pass: string, role: string){
      this.name = name
      this.userName = userName;
      this.pass= pass;
      this.role = role;
  }
}
