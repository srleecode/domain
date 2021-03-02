export const checkDomainLevels = (domain: string): void => {
  const splitDomain = domain.split('/');
  if (splitDomain.length > 2) {
    throw new Error(`Domain has more than two levels, i.e. "/": ${domain}`);
  }
};
