import usePermissions from "../hooks/usePermissions";

function PrivateWrapper(props) {
  const { children } = props;
  const { isPartnerPreview } = usePermissions();

  if (isPartnerPreview) return children;
  return null;
}

export default PrivateWrapper;
