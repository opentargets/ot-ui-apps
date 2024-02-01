declare module '*.graphql' {
  import { DocumentNode } from 'graphql';
  const Schema: DocumentNode;

  export default Schema;
}

declare module '*.gql' {
  import { DocumentNode } from 'graphql';
  const Schema: DocumentNode;

  export default Schema;
}
