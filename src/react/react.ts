import React from 'react'

const tagMap = {
    abbr: 'text',

    div: 'view',
    p: 'view',

    span: 'text',
}

const { createElement } = React
const createMiniProgramComponent = (type: string, ...rest: any[]) => createElement(tagMap[type] || type, ...rest)
React.createElement = createMiniProgramComponent as any
