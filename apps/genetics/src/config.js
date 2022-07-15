const config = {
  apiUrl:
    window.configApiUrl ?? 'https://api.genetics.dev.opentargets.xyz/graphql',
  googleTagManagerID: window.configGoogleTagManagerID ?? null,
  helpdeskEmail: window.configHelpdeskEmail ?? 'helpdesk@opentargets.org',
  profile: window.configProfile ?? {},
  platformUrl: window.configPlatformUrl ?? 'https://genetics.opentargets.org',
};

export default config;
