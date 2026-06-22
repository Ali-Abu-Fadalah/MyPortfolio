import { defineField, defineType } from 'sanity';

export const profile = defineType({
  name: 'profile',
  title: 'Profile',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'specialty',
      title: 'Specialty',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'githubUsername',
      title: 'GitHub Username',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'copyrightName',
      title: 'Copyright Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'resumeUrl',
      title: 'Resume File',
      type: 'file',
      options: { accept: '.pdf' },
    }),
    defineField({
      name: 'heroRoles',
      title: 'Hero Typewriter Roles',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'heroStats',
      title: 'Hero Stats',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', type: 'string', title: 'Value (e.g. 3+)' },
            { name: 'label', type: 'string', title: 'Label (e.g. Years exp.)' },
          ],
        },
      ],
    }),
    defineField({
      name: 'aboutCodeSnippet',
      title: 'About Section Code Snippet Data',
      type: 'object',
      fields: [
        { name: 'name', type: 'string', title: 'Name' },
        { name: 'role', type: 'string', title: 'Role' },
        { name: 'focus', type: 'array', of: [{ type: 'string' }], title: 'Focus Areas' },
        { name: 'available', type: 'boolean', title: 'Available?' },
        { name: 'location', type: 'string', title: 'Location' },
      ],
    }),
    defineField({
      name: 'aboutStats',
      title: 'About Section Animated Stats',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'target', type: 'number', title: 'Target Number' },
            { name: 'suffix', type: 'string', title: 'Suffix (e.g. +)' },
            { name: 'label', type: 'string', title: 'Label' },
          ],
        },
      ],
    }),
    defineField({
      name: 'availabilityText',
      title: 'Availability Badge Text',
      type: 'string',
    }),
    defineField({
      name: 'timelineNowText',
      title: 'Timeline "Now" Text',
      type: 'string',
    }),
    defineField({
      name: 'footerPitch',
      title: 'Footer Pitch',
      type: 'text',
    }),
    defineField({
      name: 'footerLocation',
      title: 'Footer Location Text',
      type: 'string',
    }),
    defineField({
      name: 'techCategoryOrder',
      title: 'Tech Stack Category Order',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
});
