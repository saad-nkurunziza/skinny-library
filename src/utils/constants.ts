import { makeGmailLink } from "@/lib/utils";

export const NavigationLinks = [
  {
    title: "Dashboard",
    url: "/",
  },
  {
    title: "Books",
    url: "/books",
  },
  {
    title: "Students",
    url: "/students",
  },
  {
    title: "Lending & Returns",
    url: "/circulation",
  },
];

export const SecondaryLinks = [
  {
    title: "Contact",
    url: makeGmailLink("Contact", "Hello, I would like to contact you."),
  },
  {
    title: "Help",
    url: makeGmailLink("Help", "Hello, I need some help."),
  },
];
export const schoolName = "Library System";
