# Modelo de Domínio do Aplicativo EAD

Este repositório contém o modelo de domínio para um aplicativo de ensino a distância (EAD). O modelo de domínio é uma representação visual das entidades principais e de suas interações dentro do sistema. Ele fornece uma visão geral da estrutura e das relações entre os diferentes componentes do aplicativo.

## Requisitos funcionais

**Autenticação de usuários**

* Os usuários devem ser capazes de se registrar e fazer login no sistema. Após o login, os usuários devem ter acesso às funcionalidades correspondentes ao perfil de aluno e de administrador. 

**Cadastro de cursos e aulas**

* Os usuários administradores são capazes de cadastrar e atualizar cursos e aulas.

**Visualização de Conteúdo do Curso**

* Os alunos matriculados devem poder acessar o conteúdo do curso, assistir às aulas, concluir o curso e receber certificados. 
* O sistema deve se encarregar de gerar relatórios de desempenho individual do aluno, mostrando seu progresso em horas assistidas e a data de conclusão do curso.
* No decorrer do curso, o aluno poderá visualizar a barra de progresso que é atualizada em função das aulas assistidas. 

## Requisitos não funcionais

* A senha deve estar criptografada
* O sistema deve ser capaz de detectar fraudes em relação à conclusão das aulas. Se o aluno assistir menos de 20% da duração da aula e marcar as aulas subsequentes rapidamente como concluídas, significa que está agindo de maneira suspeita. 









