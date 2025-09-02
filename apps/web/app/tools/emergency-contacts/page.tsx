"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeftIcon, PlusIcon, TrashIcon } from "lucide-react"
import Link from "next/link"

interface Contact {
  id: string
  name: string
  relationship: string
  phone: string
  email: string
  isEmergency: boolean
}

export default function EmergencyContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Pediatrician",
      relationship: "Doctor",
      phone: "",
      email: "",
      isEmergency: true
    },
    {
      id: "2", 
      name: "Poison Control",
      relationship: "Emergency",
      phone: "1-800-222-1222",
      email: "",
      isEmergency: true
    }
  ])
  const [newContact, setNewContact] = useState<Partial<Contact>>({
    name: "",
    relationship: "",
    phone: "",
    email: "",
    isEmergency: false
  })

  const addContact = () => {
    if (newContact.name && newContact.phone) {
      const contact: Contact = {
        id: Date.now().toString(),
        name: newContact.name,
        relationship: newContact.relationship || "Contact",
        phone: newContact.phone,
        email: newContact.email || "",
        isEmergency: newContact.isEmergency || false
      }
      setContacts([...contacts, contact])
      setNewContact({ name: "", relationship: "", phone: "", email: "", isEmergency: false })
    }
  }

  const removeContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id))
  }

  const printContacts = () => {
    const printContent = `
      <html>
        <head><title>Emergency Contacts</title></head>
        <body>
          <h1>Emergency Contacts</h1>
          <h2>Emergency Numbers</h2>
          <ul>
            <li>911 - Emergency Services</li>
            <li>1-800-222-1222 - Poison Control</li>
          </ul>
          <h2>Important Contacts</h2>
          <ul>
            ${contacts.map(contact => `
              <li>
                <strong>${contact.name}</strong> (${contact.relationship})<br>
                Phone: ${contact.phone}<br>
                ${contact.email ? `Email: ${contact.email}<br>` : ''}
                ${contact.isEmergency ? '<strong>EMERGENCY CONTACT</strong>' : ''}
              </li>
            `).join('')}
          </ul>
        </body>
      </html>
    `
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/tools">
                <Button variant="ghost" size="icon">
                  <ArrowLeftIcon className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Emergency Contacts</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Contact Form */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Add New Contact</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Dr. Smith"
                  value={newContact.name || ""}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="relationship">Relationship</Label>
                <Input
                  id="relationship"
                  placeholder="e.g., Pediatrician"
                  value={newContact.relationship || ""}
                  onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="e.g., (555) 123-4567"
                  value={newContact.phone || ""}
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g., doctor@clinic.com"
                  value={newContact.email || ""}
                  onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="emergency"
                  checked={newContact.isEmergency || false}
                  onChange={(e) => setNewContact({...newContact, isEmergency: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="emergency">Emergency Contact</Label>
              </div>
              
              <Button onClick={addContact} className="w-full">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </Card>

          {/* Contacts List */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Contacts</h2>
              <Button onClick={printContacts} variant="outline">
                Print List
              </Button>
            </div>
            
            <div className="space-y-4">
              {/* Emergency Numbers */}
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                <h3 className="font-semibold text-red-900 mb-2">Emergency Numbers</h3>
                <div className="space-y-1 text-sm text-red-800">
                  <p><strong>911</strong> - Emergency Services</p>
                  <p><strong>1-800-222-1222</strong> - Poison Control</p>
                </div>
              </div>

              {/* Contact List */}
              {contacts.map((contact) => (
                <div key={contact.id} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                        {contact.isEmergency && (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                            Emergency
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{contact.relationship}</p>
                      <p className="text-sm text-gray-800 font-medium">{contact.phone}</p>
                      {contact.email && (
                        <p className="text-sm text-gray-600">{contact.email}</p>
                      )}
                    </div>
                    <Button
                      onClick={() => removeContact(contact.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Tips */}
        <Card className="p-6 mt-8 bg-yellow-50 border-yellow-200">
          <h3 className="font-semibold text-yellow-900 mb-3">Emergency Preparedness Tips</h3>
          <ul className="text-sm text-yellow-800 space-y-2">
            <li>• Keep this list in multiple places (phone, wallet, fridge)</li>
            <li>• Include your pediatrician, nearest hospital, and poison control</li>
            <li>• Add trusted family members or friends who can help</li>
            <li>• Update contacts regularly and test phone numbers</li>
            <li>• Teach older children how to call emergency numbers</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
