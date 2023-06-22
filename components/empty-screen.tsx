import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@/components/ui/icons'

type ChatMessage = {
  heading: string;
  message: string;
  submit?: boolean;
}

type ExampleMessages = ChatMessage[];

const exampleMessages: ExampleMessages = [
  {
    heading: 'Data Analyst mock interview',
    message: `Act as a Interviewer for a data analyst role, ask me question one by one.`,
    submit: true
  },
  {
    heading: 'Software Engineer mock interview',
    message: `Act as a Interviewer for a software engineer role, ask me question one by one.`,
    submit: true
  },
  {
    heading: 'Explain programming code',
    message: `Explain for me the below code: \n`
  },
  {
    heading: 'Explain technical concepts',
    message: `What is a "serverless function"?`
  },
  {
    heading: 'Summarize an article',
    message: 'Summarize the following article for a 2nd grader: \n'
  },
  {
    heading: 'Draft an email',
    message: `Draft an email to my boss about the following: \n`
  }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  const handleClick = (message: ChatMessage) => {
    setInput(message.message)
    const input = document.getElementById("kevachat-input")
    if (input) {
      input.focus()
    }
    if (message.submit) {
      setTimeout(() => {
        const button = document.getElementById("kevachat-submit")
        if (button) {
          button.click()
        }
      }, 500)
    }
  }
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          Welcome to Keva Chat
        </h1>
        <p className="leading-normal text-muted-foreground">
          You can start a conversation here or try the following examples:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message: ChatMessage, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => handleClick(message)}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
