import { createDOM } from "@builder.io/qwik/testing";
import { describe, it, test, expect, vi } from "vitest";
import { Button } from "./Button";
import { HiArrowRightSolid } from '@qwikest/icons/heroicons'
import { $ } from "@builder.io/qwik";

describe('[Button component]', () => {
    it('Should call to console.log on click event', async () => {
        const { screen, render, userEvent } = await createDOM()
        const icon = $(HiArrowRightSolid);

        // Espia lo que sucede cuando se ejecuta un console.log
        const consoleLogMock = vi.spyOn(console, 'log').mockImplementation(() => {})

        // Funcion a ejecutar
        const clickHandler = $(() => {
            console.log('Click')
        })
    
        // Componente a renderizar para ejecutar la fucion
        await render(
            <Button
                size="md"
                type="button"
                variant="solid"
                Icon={icon}
                onClick={clickHandler}
            >
                Button
            </Button>
        )

        // Obtiene el componente y simula el evento de click
        const button = screen.querySelector('button')
        await userEvent(button, 'click')

        // Evala el resultado de la ejecucion del console.log
        expect(consoleLogMock).toHaveBeenCalledWith('Click') // Verifica que el resultado de la ejecucion sera el string 'Click'

        consoleLogMock.mockRestore()
    })
})
