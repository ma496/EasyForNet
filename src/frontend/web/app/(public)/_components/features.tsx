import { Users, Palette, Mail, Trash2, Lock, Layers } from 'lucide-react'

const features = [
  {
    name: 'Granular Permissions',
    description:
      'Built-in role-based access control (RBAC) with granular permissions. Easily manage what users can see and do.',
    icon: Lock,
  },
  {
    name: 'Email Service',
    description:
      'Integrated email service for notifications, password resets, and more. Ready to connect with your SMTP provider.',
    icon: Mail,
  },
  {
    name: 'Background Jobs',
    description:
      'Powered by Hangfire. Includes pre-configured jobs for token cleanup and file maintenance.',
    icon: Layers,
  },
  {
    name: 'Token & File Cleanup',
    description:
      'Automated services to keep your database and storage clean. Removes expired tokens and temporary files.',
    icon: Trash2,
  },
  {
    name: 'User Management',
    description:
      'Complete user lifecycle management. Create, update, and manage user profiles and roles out of the box.',
    icon: Users,
  },
  {
    name: 'Modern UI Components',
    description:
      'A rich library of accessible, dark-mode ready components built with Tailwind CSS and Headless UI.',
    icon: Palette,
  },
]

const Features = () => {
  return (
    <div id="features" className="bg-gray-50 py-12 dark:bg-gray-900 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold tracking-wide text-primary uppercase">Features</h2>
          <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Everything you need to build faster
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
            A complete starter kit with all the essential features pre-built, so you can focus on your unique business requirements.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 md:space-y-0">
            {features.map((feature) => (
              <div key={feature.name} className="relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
                <dt>
                  <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg font-medium leading-6 text-gray-900 dark:text-white">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

export default Features
