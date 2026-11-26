export const buildLoginPayload = ({ email, password }) => ({
  email: email.trim(),
  username: email.trim(),
  password,
});

export const buildRegistrationPayloads = ({ name, email, password, confirm }) => {
  const normalizedName = (name || '').trim();
  const normalizedEmail = (email || '').trim().toLowerCase();
  const username = normalizedName
    ? normalizedName.toLowerCase().replace(/\s+/g, '')
    : normalizedEmail.split('@')[0];

  return [
    { name: normalizedName, email: normalizedEmail, password },
    { username, email: normalizedEmail, password },
    { username, email: normalizedEmail, password1: password, password2: confirm },
    { first_name: normalizedName.split(' ')[0] || username, last_name: normalizedName.split(' ').slice(1).join(' ') || '', email: normalizedEmail, password1: password, password2: confirm },
  ];
};

export const buildRegistrationAttempts = ({ name, email, password, confirm, registerEndpoint }) => {
  const payloads = buildRegistrationPayloads({ name, email, password, confirm });
  const endpointCandidates = [
    registerEndpoint,
    registerEndpoint?.replace(/\/$/, ''),
    registerEndpoint?.endsWith('/') ? registerEndpoint.slice(0, -1) : `${registerEndpoint}/`,
    registerEndpoint?.replace(/register\/?$/, 'signup'),
    registerEndpoint?.replace(/register\/?$/, 'signup/'),
  ].filter(Boolean);

  const uniqueEndpoints = [...new Set(endpointCandidates)];

  return uniqueEndpoints.flatMap((endpoint) =>
    payloads.map((payload) => ({ endpoint, payload }))
  );
};

export const extractAuthData = (responseData) => {
  if (!responseData || typeof responseData !== 'object') {
    return {};
  }

  const token = responseData.token || responseData.access_token || responseData?.data?.access_token || responseData?.data?.token;
  const email = responseData.email || responseData.user?.email || responseData?.data?.email || responseData?.data?.user?.email;

  return {
    token,
    email,
    user: responseData.user || responseData?.data?.user || null,
  };
};
