import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import api from '../../services/api';

import App from '../../App';

const apiMock = new MockAdapter(api);

const wait = (amount = 0): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, amount));
};

const actWait = async (amount = 0): Promise<void> => {
  await act(async () => {
    await wait(amount);
  });
};

describe('Dashboard', () => {
  it('should be able to find repository', async () => {
    const { getByText, getByTestId } = render(<App />);
    const repositoryField = getByTestId('repository-input');

    fireEvent.change(repositoryField, {
      target: {
        value: 'graphql/graphql-js',
      },
    });

    await actWait();

    apiMock.onGet('repos/graphql/graphql-js').reply(200, {
      full_name: 'graphql/graphql-js',
      description: 'A reference implementation of GraphQL for JavaScript',
      owner: {
        login: 'graphql',
        avatar_url: 'https://avatars0.githubusercontent.com/u/12972006?v=4',
      },
    });

    await actWait();

    fireEvent.click(getByText('Pesquisar'));

    await actWait();

    expect(getByTestId('repository-list')).toContainElement(
      getByText('graphql/graphql-js'),
    );
  });

  it('should return error if search empty repository field', async () => {
    const { getByText } = render(<App />);

    apiMock.onGet('repos/graphql/graphql-js').reply(200, {
      full_name: 'graphql/graphql-js',
      description: 'A reference implementation of GraphQL for JavaScript',
      owner: {
        login: 'graphql',
        avatar_url: 'https://avatars0.githubusercontent.com/u/12972006?v=4',
      },
    });

    await actWait();

    fireEvent.click(getByText('Pesquisar'));

    await actWait();

    expect(getByText('Digite o autor/nome do reposítorio')).toBeInTheDocument();
  });

  it('should return error if invalid repository name', async () => {
    const { getByText, getByTestId } = render(<App />);
    const repositoryField = getByTestId('repository-input');

    fireEvent.change(repositoryField, {
      target: {
        value: 'blaasdasdsasdad',
      },
    });

    await actWait();

    apiMock.onGet('repos/graphql/graphql-js').reply(200, {
      full_name: 'graphql/graphql-js',
      description: 'A reference implementation of GraphQL for JavaScript',
      owner: {
        login: 'graphql',
        avatar_url: 'https://avatars0.githubusercontent.com/u/12972006?v=4',
      },
    });

    await actWait();

    fireEvent.click(getByText('Pesquisar'));

    await actWait();

    expect(getByText('Erro na busca por este repositório')).toBeInTheDocument();
  });
});
