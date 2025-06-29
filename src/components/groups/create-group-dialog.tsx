"use client"

import { useState } from 'react'
import { useCreateGroup } from '@/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Lock, Unlock, Users } from 'lucide-react'

interface CreateGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGroupCreated: () => void
}

export function CreateGroupDialog({ open, onOpenChange, onGroupCreated }: CreateGroupDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false,
    maxMembers: 50
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const { createGroup, loading, error } = useCreateGroup()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Group name is required'
    } else if (formData.name.length < 3) {
      newErrors.name = 'Group name must be at least 3 characters'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }
    
    if (formData.maxMembers < 2) {
      newErrors.maxMembers = 'Minimum 2 members required'
    } else if (formData.maxMembers > 100) {
      newErrors.maxMembers = 'Maximum 100 members allowed'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const group = await createGroup(formData)
    if (group) {
      setFormData({
        name: '',
        description: '',
        isPrivate: false,
        maxMembers: 50
      })
      setErrors({})
      onGroupCreated()
    }
  }

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-zinc-700">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Group</DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a group to compete with other developers and share your coding journey.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Group Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter group name..."
              className="bg-zinc-800 border-zinc-700 text-white placeholder-gray-400"
            />
            {errors.name && (
              <p className="text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe your group's purpose and goals..."
              rows={3}
              className="bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 resize-none"
            />
            {errors.description && (
              <p className="text-sm text-red-400">{errors.description}</p>
            )}
          </div>

          {/* Max Members */}
          <div className="space-y-2">
            <Label htmlFor="maxMembers" className="text-white">Maximum Members</Label>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              <Input
                id="maxMembers"
                type="number"
                min="2"
                max="100"
                value={formData.maxMembers}
                onChange={(e) => handleChange('maxMembers', parseInt(e.target.value) || 2)}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            {errors.maxMembers && (
              <p className="text-sm text-red-400">{errors.maxMembers}</p>
            )}
          </div>

          {/* Privacy Setting */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-white flex items-center gap-2">
                {formData.isPrivate ? (
                  <Lock className="h-4 w-4 text-amber-500" />
                ) : (
                  <Unlock className="h-4 w-4 text-green-500" />
                )}
                Group Privacy
              </Label>
              <p className="text-sm text-gray-400">
                {formData.isPrivate 
                  ? "Only invited members can join" 
                  : "Anyone can discover and join this group"
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className={formData.isPrivate ? "bg-amber-500/20 text-amber-300" : "bg-green-500/20 text-green-300"}
              >
                {formData.isPrivate ? "Private" : "Public"}
              </Badge>
              <Switch
                checked={formData.isPrivate}
                onCheckedChange={(checked) => handleChange('isPrivate', checked)}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-md">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-zinc-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Creating..." : "Create Group"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
