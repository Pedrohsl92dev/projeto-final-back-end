import Professor from '../entities/professor.entity';
import ProfessorRepository from '../repositories/professor.repository';
import { FilterQuery } from '../utils/database/database';
import UnauthorizedException from '../utils/exceptions/unauthorized.exception';
import Mensagem from '../utils/mensagem';
import { Validador } from '../utils/utils';
import Senha from '../view/senha.view';

export default class ProfessorController {
  async obterPorId(id: number): Promise<Professor> {
    Validador.validarParametros([{ id }]);

    return await ProfessorRepository.obterPorId(id);
  }

  async obter(filtro: FilterQuery<Professor> = {}): Promise<Professor> {
    filtro.tipo = 1;
    return await ProfessorRepository.obter(filtro);
  }

  // #pegabandeira
  async listar(filtro: FilterQuery<Professor> = {}): Promise<Professor[]> {
    filtro.tipo = 1;
    return await ProfessorRepository.listar(filtro);
  }

  // #pegabandeira
  async incluir(professor: Professor) {
    const { nome, email, senha } = professor;

    Validador.validarParametros([{ nome }, { email }, { senha }]);
    professor.tipo = 1;

    const id = await ProfessorRepository.incluir(professor);

    return new Mensagem('Professor incluido com sucesso!', {
      id,
    });
  }

  async alterar(id: number, professor: Professor) {
    const { nome } = professor;

    Validador.validarParametros([{ id }, { nome }]);
    await ProfessorRepository.alterar({ id }, professor);

    return new Mensagem('Professor alterado com sucesso!', {
      id,
    });
  }

  async alterarsenha(id: number, nova: Senha) {
    const { novaSenha, senhaAtual} = nova;
    Validador.validarParametros([{ novaSenha }, { senhaAtual }]);
    const professor = await (await ProfessorRepository.obterPorId(id));
    await Validador.validarSenha(nova.senhaAtual, professor.senha);
    professor.senha  = nova.novaSenha;
    await ProfessorRepository.alterar({ id }, professor);

    return new Mensagem('Professor alterado com sucesso!', {
      id,
    });
  }

  async excluir(id: number) {

    const professor = await new ProfessorController().obterPorId(id);

    if(professor.cursos.length){

      throw new UnauthorizedException('Você não pode deletar este professor. Ele tem cursos a lecionar.'); 

    } else {
      Validador.validarParametros([{ id }]);
      await ProfessorRepository.excluir({ id });
      return new Mensagem('Professor excluido com sucesso!', {
        id,
      });
    }

    
  }
}
