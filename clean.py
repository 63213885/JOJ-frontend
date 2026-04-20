import re

with open("src/views/user/profile/ProfileView.vue", "r", encoding="utf-8") as f:
    content = f.read()

# removing <script setup> unused vars
content = re.sub(r'import type \{ UserDetailVO \}.*?;\n', '', content)
content = re.sub(r'import type \{ UpdateProfileDTO \}.*?;\n', '', content)
content = re.sub(r'const privateInfo = ref<UserDetailVO \| null>\(null\);\n', '', content)
content = re.sub(r'const fileInput.*?null\);\n', '', content)
content = re.sub(r'const isOwner = computed\(\(\) => \{.+?\}\);\n', '', content, flags=re.DOTALL)
content = re.sub(r'const isEditing = ref\(false\);\nconst editForm = ref<UpdateProfileDTO>\([^;\n]+\);\n', '', content, flags=re.DOTALL)

# removing functions
content = re.sub(r'const triggerAvatarUpload = \(\) => \{\s*fileInput\.value\?\.click\(\);\s*\};\n', '', content)
content = re.sub(r'const onAvatarChange = async \(event: Event\) => \{.+?\}\s*\};\n\n', '', content, flags=re.DOTALL)
content = re.sub(r'const saveProfile = async \(\) => \{.+?\}\s*\};\n\n', '', content, flags=re.DOTALL)

# removing edit logic from template
content = re.sub(r'(@click="isOwner \? triggerAvatarUpload\(\) : null"|:class="\{ clickable: isOwner \}"|title="点击修改头像")', '', content)
content = re.sub(r'<input\s+type="file"\s+ref="fileInput"\s+@change="onAvatarChange"\s+accept="image/\*"\s+style="display: none"\s+/>\s*<div v-if="isOwner" class="avatar-overlay">更换头像</div>', '', content, flags=re.DOTALL)

content = content.replace('v-if="!isEditing"', '')

# The edit form is preceded by <!-- Edit Form -->
content = re.sub(r'<!-- Edit Form -->.*?</div>\s*</div>', '</div>', content, flags=re.DOTALL)

# desktop button
content = re.sub(r'<div\s+class="header-edit-row desktop-btn"\s+v-if="isOwner && !isEditing"\s*>\s*<button\s+type="button"\s+class="header-edit-btn"\s+@click="isEditing = true"\s*>\s*编辑资料\s*</button>\s*</div>', '', content, flags=re.DOTALL)

# private info box
content = re.sub(r'<!-- Private Info Box -->.*?<!-- Main Layout -->', '--><!-- Main Layout -->', content, flags=re.DOTALL)

# edit forms assignments in fetchUserProfile
content = re.sub(r'editForm.*?school: user\.value\.school,\s*\};', '', content, flags=re.DOTALL)
content = re.sub(r'if \(store\.state\.user && store\.state\.user\.account === account\) \{.*?\}\s*\}', '', content, flags=re.DOTALL)

with open("src/views/user/profile/ProfileView.vue", "w", encoding="utf-8") as f:
    f.write(content)

