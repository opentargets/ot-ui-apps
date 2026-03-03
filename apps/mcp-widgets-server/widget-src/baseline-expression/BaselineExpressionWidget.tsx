/**
 * Baseline Expression widget.
 * Fetches the gene symbol for the given Ensembl ID, then delegates to
 * the platform section Body component.
 */
import React from "react";
import { useQuery, gql } from "@apollo/client";
import { Skeleton } from "@mui/material";
import Body from "@ot/sections/target/BaselineExpression/Body";

const TARGET_SYMBOL_QUERY = gql`
  query TargetSymbol($ensgId: String!) {
    target(ensemblId: $ensgId) {
      approvedSymbol
    }
  }
`;

export default function BaselineExpressionWidget({ ensgId }: { ensgId: string }) {
  const { data, loading, error } = useQuery(TARGET_SYMBOL_QUERY, { variables: { ensgId } });

  if (loading) return <Skeleton variant="rectangular" height={200} />;
  if (error || !data?.target) return null;

  const symbol: string = data.target.approvedSymbol;

  return <Body id={ensgId} label={symbol} entity="target" />;
}
