import { render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import Posts, { getStaticProps } from "../../pages/posts";
import { getPrismicClient } from '../../services/prismic';

const posts = [
  { slug: 'fake-post', title: 'Fake Post', excerpt: 'Post excerpt', updatedAt: '10 de Abril' }
];

jest.mock('../../services/prismic');

describe('Posts page', () => {
  it('renders correctly', () => {
    render(<Posts posts={posts} />)

    expect(screen.getByText("Fake Post")).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'fake-post',
            data: {
              title: [
                { type: 'heading', text:'Fake Post' }
              ],
              content: [
                { type: 'paragraph', text:'Post excerpt' }
              ],
            },
            last_publication_date: '04-01-2021',
          }
        ]
      })
    } as any)

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [{
            slug: 'fake-post', 
            title: 'Fake Post', 
            excerpt: 'Post excerpt', 
            updatedAt: '01 de abril de 2021'
          }]
        }
      })
    )
  })
});