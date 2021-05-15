import Aluno from '../entities/aluno.entity';
import AlunoRepository from '../repositories/aluno.repository';
import { FilterQuery } from '../utils/database/database';
import UnauthorizedException from '../utils/exceptions/unauthorized.exception';
import Mensagem from '../utils/mensagem';
import { Validador } from '../utils/utils';
import Senha from '../view/senha.view';

export default class AlunoController {
  async obterPorId(id: number): Promise<Aluno> {
    Validador.validarParametros([{ id }]);
    return await AlunoRepository.obterPorId(id);
  }

  async obter(filtro: FilterQuery<Aluno> = {}): Promise<Aluno> {
    filtro.tipo = 2;
    return await AlunoRepository.obter(filtro);
  }

  // #pegabandeira
  async listar(filtro: FilterQuery<Aluno> = {}): Promise<Aluno[]> {
    filtro.tipo = 2;
    return await AlunoRepository.listar(filtro);
  }

  // #pegabandeira
  async incluir(aluno: Aluno) {
    const { nome, formacao, idade, email, senha } = aluno;
    Validador.validarParametros([{ nome }, { formacao }, { idade }, { email }, { senha }]);    
    aluno.tipo = 2; 
    const id = await AlunoRepository.incluir(aluno);
    return new Mensagem('Aluno incluido com sucesso!', {
      id,
    });
  }

  async alterar(id: number, aluno: Aluno) {    
    aluno.senha = await (await AlunoRepository.obterPorId(id)).senha;
    const { nome, formacao, idade, senha} = aluno;

    Validador.validarParametros([{ nome }, { formacao }, { idade }, { id }, { senha }]);
    
    await AlunoRepository.alterar({ id }, aluno);
    return new Mensagem('Aluno alterado com sucesso!', {
      id,
    });
  }

  async alterarsenha(id: number, nova: Senha) {
    const { novaSenha, senhaAtual} = nova;
    Validador.validarParametros([{ novaSenha }, { senhaAtual }]);
    const aluno = await (await AlunoRepository.obterPorId(id));
    await Validador.validarSenha(nova.senhaAtual, aluno.senha);
    aluno.senha  = nova.novaSenha;
    await AlunoRepository.alterar({ id }, aluno);

    return new Mensagem('Aluno alterado com sucesso!', {
      id,
    });
  }

  async excluir(id: number) {

    const aluno = await new AlunoController().obterPorId(id);

    if(aluno.cursos.length) {
      throw new UnauthorizedException('Você não pode deletar este aluno, ele está matriculado em um curso.'); 
    } else {
      Validador.validarParametros([{ id }]);
      await AlunoRepository.excluir({ id });
      return new Mensagem('Aluno excluido com sucesso!', {
        id,
      });
    }
  }
}
