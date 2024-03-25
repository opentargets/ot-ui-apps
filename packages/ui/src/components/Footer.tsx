import { Grid, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { makeStyles } from "@mui/styles";

import Link from "./Link";
import { EmailLink } from "./EmailLink";

import PrivateWrapper from "./PrivateWrapper";

const FOOTER_BACKGROUND_COLOR = "#2e2d35";

const useStyles = makeStyles(() => ({
  footer: {
    backgroundColor: FOOTER_BACKGROUND_COLOR,
    color: "#fff",
    margin: 0,
    width: "100%",
  },
}));

const useLinkStyles = makeStyles(() => ({
  iconClass: {
    marginRight: "10px",
  },
  linkContainer: {
    marginBottom: "8px",
  },
}));

export type FooterExternalLink = {
  url: string;
  label?: string;
  showOnlyPartner?: boolean;
  icon?: IconProp;
};

const FooterLink = ({ label, url, icon }: FooterExternalLink) => {
  const classes = useLinkStyles();
  return (
    <Grid item xs={12} sx={{ mb: 1 }}>
      <Typography color="inherit">
        {url.startsWith("mailto") ? (
          <EmailLink href={url} label={label} icon={icon} />
        ) : (
          <Link ariaLabel={`Read more about ${label} on this link`} external footer to={url}>
            {icon && <FontAwesomeIcon className={classes.iconClass} icon={icon} size="lg" />}
            {label}
          </Link>
        )}
      </Typography>
    </Grid>
  );
};

type FooterSectionHeadingProps = {
  children: React.ReactNode;
};
const FooterSectionHeading = ({ children }: FooterSectionHeadingProps) => (
  <Grid item xs={12}>
    <Typography variant="h6" color="inherit">
      {children}
    </Typography>
  </Grid>
);

const useSocialLinkStyle = makeStyles(() => ({
  iconsContainer: {
    maxWidth: "235px",
  },
  socialIcon: {
    fontSize: "30px",
    color: "white",
  },
}));

type FooterSocialProps = {
  social: FooterExternalLink[];
};
const FooterSocial = ({ social }: FooterSocialProps) => {
  const classes = useSocialLinkStyle();
  const socialsWithIcons = social.filter(s => s.icon);
  return (
    <>
      <FooterSectionHeading>Follow us</FooterSectionHeading>
      <Grid className={classes.iconsContainer} container justifyContent="space-between">
        {socialsWithIcons.map(({ icon, url, label }, i) => (
          <Grid item key={i}>
            <Link external footer to={url} ariaLabel={label}>
              <FontAwesomeIcon className={classes.socialIcon} icon={icon!} />
            </Link>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

const useSectionStyles = makeStyles({
  section: {
    width: "100%",
  },
});

type FooterSectionProps = {
  heading: React.ReactNode;
  links: FooterExternalLink[];
  social?: FooterExternalLink[];
  children?: React.ReactNode;
};
const FooterSection = ({ heading, links, social, children }: FooterSectionProps) => {
  const classes = useSectionStyles();
  return (
    <Grid item xs={12} sm={6} md={3} container direction="column" justifyContent="space-between">
      <Grid item className={classes.section}>
        <FooterSectionHeading>{heading}</FooterSectionHeading>
        {links.map((link, i) => {
          if (link.showOnlyPartner) {
            return (
              <PrivateWrapper key={i}>
                <FooterLink label={link.label} url={link.url} icon={link.icon} />
              </PrivateWrapper>
            );
          } else {
            return <FooterLink key={i} label={link.label} url={link.url} icon={link.icon} />;
          }
        })}
      </Grid>

      {social ? (
        <Grid item>
          <FooterSocial social={social} />
        </Grid>
      ) : null}
      {children}
    </Grid>
  );
};

// Creative Commons License
const useLicenseStyles = makeStyles({
  icon: {
    marginLeft: "3px",
    verticalAlign: "middle",
  },
  link: {
    display: "inline-block",
  },
});

type LicenseCC0Props = {
  link: FooterExternalLink;
};
const LicenseCC0 = ({ link }: LicenseCC0Props) => {
  const classes = useLicenseStyles();
  return (
    <div>
      <Typography color="inherit" variant="caption">
        <Link
          ariaLabel={`Read more about ${link.label} on this link`}
          to={link.url}
          external
          footer
          className={classes.link}
        >
          {link.label}
        </Link>{" "}
        is marked with{" "}
        <Link
          to="http://creativecommons.org/publicdomain/zero/1.0?ref=chooser-v1"
          external
          footer
          className={classes.link}
          ariaLabel={`Read more about creative commons license on this link`}
        >
          CC0 1.0
          <img
            alt="cc0 license image 1"
            aria-label="cc0 license image 1"
            className={classes.icon}
            src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"
            height="22px"
            width="22px"
          />
          <img
            alt="cc0 license image 2"
            aria-label="cc0 license image 2"
            className={classes.icon}
            src="https://mirrors.creativecommons.org/presskit/icons/zero.svg?ref=chooser-v1"
            height="22px"
            width="22px"
          />
        </Link>
      </Typography>
    </div>
  );
};

export type FooterExternalLinks = {
  about: FooterExternalLink[];
  help: FooterExternalLink[];
  license: FooterExternalLink;
  partners: FooterExternalLink[];
  network: FooterExternalLink[];
  social: FooterExternalLink[];
};
type FooterProps = {
  externalLinks: FooterExternalLinks;
};
const Footer = ({ externalLinks }: FooterProps) => {
  const classes = useStyles();
  return (
    <Grid sx={{ p: 3 }} className={classes.footer} container justifyContent="center" spacing={3}>
      <Grid item container xs={12} md={10} spacing={2}>
        <FooterSection heading="About" links={externalLinks.about}>
          <LicenseCC0 link={externalLinks.license} />
        </FooterSection>
        <FooterSection heading="Help" links={externalLinks.help} social={externalLinks.social} />
        <FooterSection heading="Partners" links={externalLinks.partners} />
        <FooterSection heading="About Open Targets" links={externalLinks.network} />
      </Grid>
    </Grid>
  );
};

export default Footer;
