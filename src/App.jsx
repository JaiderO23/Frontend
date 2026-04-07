import Button from './components/ui/Button'
import Input from './components/ui/Input'
import Card from './components/ui/Card'
import { useState } from 'react'

function App() {
  const [nombre, setNombre] = useState('')
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🚀 Sistema POS
          </h1>
          <p className="text-gray-600">
            Prueba de Componentes Reutilizables
          </p>
        </div>

        {/* Card con Inputs */}
        <Card title="Formulario de Prueba">
          <div className="space-y-4">
            <Input
              label="Nombre"
              placeholder="Ingresa tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            
            <Input
              label="Email"
              type="email"
              placeholder="correo@ejemplo.com"
            />
            
            <Input
              label="Campo con error"
              error="Este campo es obligatorio"
            />
          </div>
        </Card>

        {/* Card con Botones */}
        <Card title="Variantes de Botones">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">
              Primary
            </Button>
            
            <Button variant="secondary">
              Secondary
            </Button>
            
            <Button variant="success">
              Success
            </Button>
            
            <Button variant="danger">
              Danger
            </Button>
            
            <Button variant="outline">
              Outline
            </Button>
            
            <Button disabled>
              Disabled
            </Button>
          </div>
        </Card>

        {/* Card con Tamaños */}
        <Card title="Tamaños de Botones">
          <div className="flex flex-wrap gap-3 items-center">
            <Button size="sm">
              Small
            </Button>
            
            <Button size="md">
              Medium
            </Button>
            
            <Button size="lg">
              Large
            </Button>
          </div>
        </Card>

      </div>
    </div>
  )
}

export default App