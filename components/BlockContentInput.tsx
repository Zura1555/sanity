import React, {useCallback} from 'react'
import {Card} from '@sanity/ui'
import {type PortableTextInputProps, type RenderArrayOfObjectsItemCallback} from 'sanity'

export function BlockContentInput(props: PortableTextInputProps) {
  const renderItem = useCallback<RenderArrayOfObjectsItemCallback>(
    (itemProps) => {
      const isTable =
        itemProps.schemaType?.name === 'table' || (itemProps.value as {_type?: string})?._type === 'table'

      if (!isTable) {
        return props.renderItem(itemProps)
      }

      return (
        <Card padding={0} radius={2} tone="default" border>
          {props.renderInput(itemProps.inputProps)}
        </Card>
      )
    },
    [props],
  )

  return props.renderDefault({
    ...props,
    renderItem,
  })
}
