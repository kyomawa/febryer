// ==========================================================================================================

export type NavbarLinkProps = {
  path: string;
  label: string;
};

// ==========================================================================================================

export type SidebarLinkProps = {
  path: string;
  label: string;
  icon: React.ReactNode;
};

// ==========================================================================================================

export type EmailCreateUserProps = {
  name: string;
  email: string;
  password: string;
  link: string;
};
