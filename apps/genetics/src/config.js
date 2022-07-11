const config = {
  apiUrl:
    window.configApiUrl ??
    // 'https://open-targets-genetics-dev.ew.r.appspot.com/graphql',
    // TODO: production API to be used for testing/preview purposes only; revert before merging
    'https://api.genetics.opentargets.org/graphql',
  googleTagManagerID: window.configGoogleTagManagerID ?? null,
  helpdeskEmail: window.configHelpdeskEmail ?? 'helpdesk@opentargets.org',
  profile: window.configProfile ?? {},
  platformUrl: window.configPlatformUrl ?? 'https://genetics.opentargets.org',
};

export default config;
