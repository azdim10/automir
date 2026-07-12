import { useState, type SyntheticEvent } from 'react'

import { Button, Input, Modal, Typography } from '@shared/ui'
import { PhoneIcon } from '@shared/ui/icon/PhoneIcon'

import { useCreateCallbackRequest } from '../model/useCreateCallbackRequest'

export interface CallbackLabels {
  close: string
  description: string
  error: string
  name: string
  phone: string
  requestCall: string
  submit: string
  success: string
  title: string
}

interface RequestCallbackButtonProps {
  labels: CallbackLabels
}

export function RequestCallbackButton({ labels }: RequestCallbackButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const createCallbackMutation = useCreateCallbackRequest()

  function handleClose() {
    setIsOpen(false)
    setName('')
    setPhone('')
    setIsSubmitted(false)
    createCallbackMutation.reset()
  }

  function handleOpen() {
    setIsOpen(true)
  }

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()

    createCallbackMutation.mutate(
      { name, phone },
      {
        onSuccess: () => {
          setIsSubmitted(true)
        },
      },
    )
  }

  return (
    <>
      <button
        aria-label={labels.requestCall}
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 transition-colors hover:border-slate-300 hover:bg-slate-50"
        title={labels.requestCall}
        type="button"
        onClick={handleOpen}
      >
        <PhoneIcon className="h-5 w-5" />
      </button>

      <Modal
        description={labels.description}
        isOpen={isOpen}
        size="sm"
        title={labels.title}
        onClose={handleClose}
      >
        {isSubmitted ? (
          <div className="grid gap-4">
            <Typography className="text-slate-600" variant="body">
              {labels.success}
            </Typography>
            <Button fullWidth onClick={handleClose}>
              {labels.close}
            </Button>
          </div>
        ) : (
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <Input
              required
              fullWidth
              placeholder={labels.name}
              value={name}
              onChange={(event) => {
                setName(event.target.value)
              }}
            />
            <Input
              required
              fullWidth
              placeholder={labels.phone}
              type="tel"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value)
              }}
            />
            <Button
              fullWidth
              isLoading={createCallbackMutation.isPending}
              type="submit"
            >
              {labels.submit}
            </Button>
            {createCallbackMutation.isError ? (
              <Typography className="text-red-600" variant="body-sm">
                {labels.error}
              </Typography>
            ) : null}
          </form>
        )}
      </Modal>
    </>
  )
}
