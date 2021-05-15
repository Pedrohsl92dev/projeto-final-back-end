import bcrypt from 'bcryptjs';
import BusinessException from '../utils/exceptions/business.exception';
import UnauthorizedException from '../utils/exceptions/unauthorized.exception';
import ProfessorController from '../controllers/professor.controller';
import AlunoController from '../controllers/aluno.controller';

export const Validador = {
  validarParametros: (parametros: any[]) => {
    if (!parametros) return true;

    const parametrosInvalidos = parametros
      .filter((p) => {
        const attr = Object.keys(p)[0];
        return (
          p[attr] === null ||
          p[attr] === undefined ||
          (typeof p[attr] === 'number' && isNaN(p[attr])) ||
          (typeof p[attr] === 'string' && p[attr] === '')
        );
      })
      .map((p) => Object.keys(p)[0]);

    if (parametrosInvalidos.length) {
      throw new BusinessException(`Os seguintes parametros são obrigatórios: ${parametrosInvalidos.join(', ')}`);
    }
    return true;
  },

  validarSenha: (senha: string, senhaAtual: string) => {
    const isValid = bcrypt.compareSync(senha, senhaAtual);

    if (!isValid) {
      throw new UnauthorizedException('Usuário ou senha inválida.');
    }
  },

  validarNome: (nome:string) =>{
    let re = /^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/
    if(re.test(nome)){ 
      return nome     
    }else{
     throw new UnauthorizedException('Nome está invalido');
    }
  },

  validarEmail: async (email: string)=>{
    let re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

    const emailPfExist = await  new ProfessorController().listar({email:{$eq:email} })
    const emailAlExist = await new AlunoController().listar({email:{$eq:email}})
    
    if(re.test(email) && !(emailAlExist.length || emailPfExist.length) ){
      return email
    }
    else{
      throw new UnauthorizedException('Email já cadastrado.');
    }   
  },

  validarIdade:(idade: string) =>{
    let re = /[0-9]/
    if(re.test(idade)){
      return idade
    }else{
      throw new UnauthorizedException('Formato de idade inválida.');
    }
  },
  
  criptografarSenha: (senha: string): string => {
    return bcrypt.hashSync(senha, 8);
  },
};
