module.exports = function (plop) {
  plop.setGenerator("Factory", {
    description: "Generate factory files",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is your resource name? e.x) user, shop, product",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/application/factories/{{ pascalCase name }}/{{ pascalCase name }}ControllerFactory.ts",
        templateFile: "plop-templates/Factory/ControllerFactory.hbs",
      },
      {
        type: "add",
        path: "src/application/factories/{{ pascalCase name }}/{{ pascalCase name }}RepositoryFactory.ts",
        templateFile: "plop-templates/Factory/RepositoryFactory.hbs",
      },
      {
        type: "add",
        path: "src/application/factories/{{ pascalCase name }}/{{ pascalCase name }}UseCaseFactory.ts",
        templateFile: "plop-templates/Factory/UseCaseFactory.hbs",
      },
    ],
  });

  plop.setGenerator("UseCase", {
    description: "Generate use case files",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is your resource name? e.x) user, shop, product",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/application/usecases/{{ pascalCase name }}UseCase/index.ts",
        templateFile: "plop-templates/UseCase/index.hbs",
      },
      {
        type: "add",
        path: "src/application/usecases/{{ pascalCase name }}UseCase/I{{ pascalCase name }}UseCase.ts",
        templateFile: "plop-templates/UseCase/IUseCase.hbs",
      },
      {
        type: "add",
        path: "src/application/usecases/{{ pascalCase name }}UseCase/{{ pascalCase name }}UseCase.ts",
        templateFile: "plop-templates/UseCase/UseCase.hbs",
      },
      {
        type: "add",
        path: "tests/application/usecases/{{ pascalCase name }}UseCase.test.ts",
        templateFile: "plop-templates/UseCase/UseCaseTest.hbs",
      },
    ],
  });

  plop.setGenerator("Entity", {
    description: "Generate entity files",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is your resource name? e.x) user, shop, product",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/domain/entities/{{ pascalCase name }}.ts",
        templateFile: "plop-templates/Entity/Entity.hbs",
      },
      {
        type: "add",
        path: "tests/domain/entities/{{ pascalCase name }}.test.ts",
        templateFile: "plop-templates/Entity/EntityTest.hbs",
      },
    ],
  });

  plop.setGenerator("Repository", {
    description: "Generate repository files",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is your resource name? e.x) user, shop, product",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/domain/repositories/{{ pascalCase name }}Repository/index.ts",
        templateFile: "plop-templates/Repository/index.hbs",
      },
      {
        type: "add",
        path: "src/domain/repositories/{{ pascalCase name }}Repository/I{{ pascalCase name }}Repository.ts",
        templateFile: "plop-templates/Repository/IRepository.hbs",
      },
      {
        type: "add",
        path: "src/domain/repositories/{{ pascalCase name }}Repository/{{ pascalCase name }}Repository.ts",
        templateFile: "plop-templates/Repository/Repository.hbs",
      },
      {
        type: "add",
        path: "tests/domain/repositories/{{ pascalCase name }}Repository.test.ts",
        templateFile: "plop-templates/Repository/RepositoryTest.hbs",
      },
    ],
  });

  plop.setGenerator("Router", {
    description: "Generate router files",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is your resource name? e.x) user, shop, product",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/infrastructure/http/routes/{{ camelCase name }}Routes.ts",
        templateFile: "plop-templates/Router/Routes.hbs",
      },
    ],
  });

  plop.setGenerator("Controller", {
    description: "Generate controller files",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is your resource name? e.x) user, shop, product",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/interface/controllers/{{ pascalCase name }}Controller/index.ts",
        templateFile: "plop-templates/Controller/index.hbs",
      },
      {
        type: "add",
        path: "src/interface/controllers/{{ pascalCase name }}Controller/I{{ pascalCase name }}Controller.ts",
        templateFile: "plop-templates/Controller/IController.hbs",
      },
      {
        type: "add",
        path: "src/interface/controllers/{{ pascalCase name }}Controller/{{ pascalCase name }}Controller.ts",
        templateFile: "plop-templates/Controller/Controller.hbs",
      },
      {
        type: "add",
        path: "tests/interface/controllers/{{ pascalCase name }}Controller.test.ts",
        templateFile: "plop-templates/Controller/ControllerTest.hbs",
      },
    ],
  });

  plop.setGenerator("Value Object", {
    description: "Generate Value Object files",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is your resource name? e.x) user, shop, product",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/domain/valueObjects/{{ pascalCase name }}.ts",
        templateFile: "plop-templates/ValueObjects/ValueObjects.hbs",
      },
      {
        type: "add",
        path: "tests/domain/valueObjects/{{ pascalCase name }}.test.ts",
        templateFile: "plop-templates/ValueObjects/ValueObjectsTest.hbs",
      },
    ],
  });
};
