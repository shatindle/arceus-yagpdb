{{/* Created by Krabs
	Part of the note system.
 
	Syntax is -note <user>
	This command will return all notes for the user. This can be used to track certain user actions within the server.
*/}}
 
{{$args := parseArgs 1 "Syntax is `-notes <userID>`" (carg "userid" "userID")}}
 
{{if ne .Channel.ParentID 975437545812942929}}
	{{deleteTrigger 0}}
{{end}}
 
{{$user := ""}}
{{$modCategory := 0}}
 
{{if .ExecData}}
	{{$user = (userArg .ExecData.UserID)}}
{{else}}
	{{$user = (userArg ($args.Get 0))}}
{{end}}
 
{{if not $user}}
	{{if eq .Channel.ParentID $modCategory}}
		{{sendMessage nil (joinStr "" .User.Mention ", please use a valid user ID or user mention.")}}
	{{else}}
		{{sendDM (joinStr "" .User.Mention ", please use a valid user ID or user mention.\n```" .Message.Content "```")}}
	{{end}}
{{else}}
	{{$note := ((dbGet $user.ID "notes").Value).StringSlice}}
	{{$fullNote := (joinStr "\n-----------\n\n" $note)}}
 
	{{if not $note}}
		{{$fullNote = ":x: No notes here!"}}
	{{end}}
	
	{{$embed := cembed
		"title" "Server Notes"
		"author" (sdict "name" (joinStr "" $user.String " (" $user.ID ")") "icon_url" ($user.AvatarURL "256"))
		"description" $fullNote
		"color" 0x800080
		"footer" (sdict "text" (joinStr "" "Requested by " .User.String))
		"timestamp" currentTime
	}}
	
	{{if eq .Channel.ParentID $modCategory}}
		{{sendMessage nil $embed}}
	{{else}}
		{{sendDM $embed}}
	{{end}}
{{end}}