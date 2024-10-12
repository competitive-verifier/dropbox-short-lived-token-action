import * as core from '@actions/core'
import { HttpClient } from '@actions/http-client'
import { BasicCredentialHandler } from '@actions/http-client/lib/auth'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const appKey = core.getInput('app-key')
    const appSecret = core.getInput('app-secret')
    const refreshToken = core.getInput('refresh-token')

    const http = new HttpClient('dropbox-short-lived-token-action', [
      new BasicCredentialHandler(appKey, appSecret)
    ])

    const data = `grant_type=refresh_token&refresh_token=${refreshToken}`
    const response = await http.post(
      'https://api.dropbox.com/oauth2/token',
      data
    )
    const body = await response.readBody()

    const token = JSON.parse(body)['access_token']
    core.setSecret(token)
    core.exportVariable('DROPBOX_TOKEN', token)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
