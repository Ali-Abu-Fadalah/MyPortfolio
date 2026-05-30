import { defineField, defineType } from 'sanity';

export const skill = defineType({
  name: 'skill',
  title: 'Skill',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Frontend', value: 'Frontend' },
          { title: 'Backend', value: 'Backend' },
          { title: 'Database', value: 'Database' },
          { title: 'DevOps & Tools', value: 'DevOps & Tools' },
          { title: 'AI & Machine Learning', value: 'AI & Machine Learning' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
});
